const groupService = require("../services/group-service");
const User = require("../models/user-model");
class GroupController{

    async addGroup(req,res){
        const {name,createdBy,members,description} = req.body;

        if(!name || !members){
            return res.status(400).json({ message: 'All fields are required!' });
        }

        try {
            
            const group  = await groupService.createGroup({name,createdBy,members,description});
            const groupId = group._id;
            members.forEach(addGroupId);
            
            async function addGroupId(userId) {
                try {
                    // Fetch the user by userId
                    const user = await User.findOne({ _id: userId });

                    if (!user) {
                        console.log(`User with ID ${userId} not found.`);
                        return;  // Skip this user if they are not found
                    }
                    
                    // Initialize inGroups array if it doesn't exist
                    let inGroups = user.inGroups || [];

                    // Add the groupId to inGroups
                    inGroups.push( groupId );

                    // Update the user's inGroups field
                    await User.findOneAndUpdate(
                        { _id: userId },  // Find the user by userId
                        { $set: { inGroups } },  // Update fields
                        { new: true }  // Return the updated document
                    );
                }
                catch (error) {
                    console.error(`Error updating user ${userId}:`, error);
                }
            }
            
                res.status(200).json({
                    message: 'Group Created' , group: group
                });
            
           
            

        } catch (error) {
            // Catch any other errors (e.g., network issues)
            console.error('Error:', error);
        }
    }

    // Delete an existing group
    async deleteGroup(req, res) {
        const { groupId } = req.params;
        const { userId } = req.body;

        try {
            // Fetch the group
            const group = await groupService.findGroupById({_id: groupId});
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Ensure only the owner can delete the group
            if (group.createdBy.toString() !== userId) {
                return res.status(403).json({ message: 'Only the owner can delete this group' });
            }

            // Remove group from each member's inGroups
            const members = group.members;
            for (const memberId of members) {
                await User.updateOne(
                    { _id: memberId },
                    { $pull: { inGroups: groupId } }
                );
            }

            // Delete the group
            await groupService.deleteGroup(groupId);

            res.status(200).json({ message: 'Group deleted successfully' });

        } catch (error) {
            console.error('Error deleting group:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // Update an existing group (add/drop members)
    async updateGroup(req, res) {
        const { groupId } = req.params;
        const { userId, newMembers, removedMembers } = req.body;

        try {
            // Fetch the group
            const group = await groupService.findGroupById({_id: groupId});
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Ensure only the owner can update the group
            if (group.createdBy.toString() !== userId) {
                return res.status(403).json({ message: 'Only the owner can update this group' });
            }

            // Add new members
            if (newMembers && newMembers.length > 0) {
                for (const newMemberId of newMembers) {
                    // Add to the group members
                    group.members.push(newMemberId);

                    // Add the group to the new member's inGroups array
                    await User.updateOne(
                        { _id: newMemberId },
                        { $addToSet: { inGroups: groupId } }
                    );
                }
            }

            // Remove members
            if (removedMembers && removedMembers.length > 0) {
                for (const removedMemberId of removedMembers) {
                    // Remove from the group members
                    group.members.pull(removedMemberId);

                    // Remove the group from the member's inGroups array
                    await User.updateOne(
                        { _id: removedMemberId },
                        { $pull: { inGroups: groupId } }
                    );
                }
            }

            // Save updated group
            await group.save();

            res.status(200).json({ message: 'Group updated successfully' });

        } catch (error) {
            console.error('Error updating group:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

module.exports = new GroupController(); 