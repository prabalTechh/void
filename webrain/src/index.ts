import express from "express";
import { contentModel, linkModel, userModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    await userModel.create({
      username: username,
      password: password,
    });

    res.json({
      message: "user is SIgned Up",
    });
  } catch (e) {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await userModel.findOne({
    username,
    password,
  });

  if (existingUser) {
    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_PASSWORD
    );

    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Incorrect Credentials",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const title = req.body.title;
  const link = req.body.link;

  await contentModel.create({
    title,
    link,
    tags: [],
    //@ts-ignore
    userId: req.userId,
  });
  res.json({
    message: "Content Added !",
  });
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.userId;
  const content = await contentModel
    .find({
      userId: userId,
    })
    .populate("userId");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const contentId = req.body.contentId;

  await contentModel.deleteMany({
    contentId,

    //@ts-ignore
    userId: req.userId,
  });
  res.json({
    message: "content is Deleted!",
  });
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const share = req.body.share;

  if(share){
    const existingLink = await linkModel.findOne({
      //@ts-ignore
      userId : req.userId
    });
    if(existingLink){
      res.json({
        hash: existingLink.hash
      })

      return;
    }
 
const hash = random(12);
  
   await linkModel.create({
      //@ts-ignore
      userId: req.userId,
      hash,
    });
  
  res.json({
      hash    
  });
} else{
  await linkModel.deleteOne({
    // @ts-ignore
    userId: req.userId
  })
  res.json({
    message: "Removed link"
})
}
});

app.get("/api/v1/brain/:shareLink" , async (req, res)=>{
  const hash = req.params.shareLink;

  const link =  await linkModel.findOne({
    hash
  });

  if(!link){
    res.status(411).json({
      message: "sorry incorrect request"
    })
    return ;
  }

  //userId
  const content = await contentModel.find({
      userId : link.userId
  })

  const user = await userModel.findOne({
    _id : link.userId
  })

  res.json({
    username: user?.username,
    content: content
  })

})

app.listen(4000, () => console.log("Listening to the Port 4000"));
