"use strict";

const User = require("../Database/User");

const logUtilities = require("./utility/logUtilities");

const editOwnDotaNickname = async (body, message) => {
    logUtilities.title("Edit");
    const bodyStr = body.join(" ").trim();
    if (bodyStr === "") {
        console.log("No nickname provided".error);
        console.log(logUtilities.separator);
        message.channel.send("No nickname provided");
        return;
    }
    const currentUser = await User.findOne({
        discordID: message.member.user.id,
    });
    if (currentUser === null) {
        console.log(
            "User that invoked this command is not registered".error
        );
        console.log(logUtilities.separator);
        message.channel.send("You are not registered");
        return;
    }
    if (!currentUser.canEdit) {
        console.log(
            "User that invoked this command is banned from editing his nickname"
                .error
        );
        console.log(logUtilities.separator);
        message.channel.send(
            "You were banned from editing your nickname"
        );
        return;
    }
    await User.findOneAndUpdate(
        {
            discordID: message.member.user.id,
        },
        {
            dotaNickname: bodyStr,
        },
        err => {
            if (err) {
                console.error(err);
            } else {
                console.log("Nickname successfully updated".log);
                console.log(logUtilities.separator);
                message.channel.send(
                    "Your nickname was updated successfully"
                );
            }
        }
    );
};

module.exports = editOwnDotaNickname;
