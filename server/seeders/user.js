import Chat from "../models/chat.js";
import User from "../models/user.js";
import { faker } from "@faker-js/faker";

const createUser = async (numUsers) => {
  try {
    const usersPromise = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(10),
        password: "password",
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });

      usersPromise.push(tempUser);
    }

    await Promise.all(usersPromise);

    console.log("Users created ", numUsers);
    process.exit(1);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};


const createSingleChats = async (chatsCount) => {
  try {
     const users = await User.find().select("_id");

     const chatsPromise = [];

     for(let i=0 ; i < users.length; i++){
      for (let j=i+1 ; j < users.length; j++){
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]],
          })
        );
      }
     }

     await Promise.all(chatsPromise);

     console.log("Chats created successfully");
     process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// const createGroupChats = async (numChats)=>{
//     try {
//       const users = await User.find().select("_id");
//       const chatsPromise = [];

//       for(let i=0; i < numChats; i++){
//         const numMembers = simpleFaker.number.int({min:3, max:users.length});
//         const members = [];

//         for(let i=0; i<numMembers; i++){
//           const randomIndex = Math.floor(Math.random() * users.length);
//           const randomUser = users[randomIndex];

//           if(!members.includes(randomUser)){
//             members.push(randomUser);
//           }
//         }

//         const chat = Chat.create({
//           groupChat: true,
//           name: faker.lorem.words(1),

//         })
//           })
//         );
//       }
//     }

// };
export { createUser, createSingleChats,/* createGroupsChats*/ };
