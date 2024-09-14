const userService = require('../services/user-service');
const mongoose = require('mongoose');
const User = require("../models/user-model");


class ConnectController {
    
    // verify codeforces handle
    async verifyHandle(req,res){
        const { email,handle,isVerified} = req.body;
        
        if(!handle){
            res.status(400).json({ message: 'handle field is required!' });
        }
        // check if any handle is already connected
        if(isVerified)
        {
            res.status(400).json({ message: 'A codeforces account is already connected' });
            console.log("isVerified Check");
            return;
        }
         
        // Check if the handle is connected to any other account 
        const user = await userService.findUser({ handle: handle });
        if(user) {
            return res.status(400).json({ message: 'Handle connected to another account' });
        }

        const ttl =  60 * 5; // 5 min
        const expires = (Date.now()/1000) + ttl;
        const count = 1;
        // Define the async function to get user submissions
        async function getUserSubmission(handle, count) {
            // Construct the dynamic URL using template literals
            const userStatusApi = `https://codeforces.com/api/user.status?handle=${handle}&from=1&count=${count}`;
            console.log(expires);
            try {
                // Fetch data from the dynamic API URL
                const response = await fetch(userStatusApi);

                // Check if the response is successful
                if (response.ok) {
                    // Parse the response JSON
                    const result = await response.json();

                    // Extract the first submission from the result (index 0)
                    const submission = result.result[0];

                    // Log the submission data to see what it contains
                    console.log('Submission Data:', submission);
                    console.log("time difference",(expires - submission.creationTimeSeconds));
                    console.log("ttl : ",ttl);
                    // Perform business logic (example: check if the problem was solved correctly)
                    if(submission.verdict == "COMPILATION_ERROR" && submission.problem.contestId == 1063 && submission.problem.index == "B" && (expires - submission.creationTimeSeconds) <= 2 * ttl)
                    {
                        // Update the user in the database with isVerified = true and handle
                        const updatedUser = await User.findOneAndUpdate(
                            { email: email }, // Find the user by email
                            { $set: { isVerified: true, handle: handle } }, // Update fields
                            { new: true } // Return the updated document
                        );

                        if (updatedUser) {
                            return res.status(200).json({ message: 'Handle successfully verified', user: updatedUser });
                        } else {
                            return res.status(404).json({ message: 'User not found' });
                        }

                    }
                    else 
                    {
                        res.status(400).json({ message: 'Incorrect or No Submission Made' });
                    }    
                    
                    

                } else {
                    // Handle the error if the response failed
                    console.error('Error fetching data:', response.status);
                }

            } catch (error) {
                // Catch any other errors (e.g., network issues)
                console.error('Error:', error);
            }
        }

        getUserSubmission(handle, count);
  
    }

    async removeHandle(req,res){
        const { email} = req.body;
        try {

            const updatedUser = await User.findOneAndUpdate(
                { email: email }, // Find the user by email
                { $set: { isVerified: false, handle: "-" } }, // Update fields
                { new: true } // Return the updated document
            );

            if (updatedUser) {
                return res.status(200).json({ message: 'Handle successfully disconnected', user: updatedUser });
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            // Catch any other errors (e.g., network issues)
            console.error('Error:', error);
        }

    }

    
}

module.exports = new ConnectController();