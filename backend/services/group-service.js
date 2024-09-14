const GroupModel = require("../models/group-model")

class GroupService{

    async createGroup(data)
    {
        const group = await GroupModel.create({
            name : data.name,createdBy: data.createdBy, members: data.members, description : data.description
        });
        return group;
    }

    async findGroupById(filter) {
        const group = await GroupModel.findOne(filter);
        return group;
    }

    async deleteGroup(groupId){
        // complete this
        await GroupModel.findByIdAndDelete(groupId);
    }


}

module.exports = new GroupService();