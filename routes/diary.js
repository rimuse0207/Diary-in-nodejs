const express = require("express");
const router = express.Router();
const { Posts, Users, Replys } = require("../models");
const { isLoggedIn } = require("./userCheck");

const { tokenCheck } = require("./writercheck");

router.get("/show", isLoggedIn, (req, res) => {
  res.render("diary/show");
});

// 일기장 추가하기
router.post("/board", isLoggedIn, async (req, res, next) => {
  const body = req.body;

  try {
    await Posts.create({
      public: body.public,
      content: body.inputTitle,
      email: req.user
    });

    return res.redirect("texts");
  } catch (error) {
    console.log("일기장 추가 실패");
    console.error(error);
    return res.redirect("./error");
  }
});

// 읽기장 보기

router.get("/texts", isLoggedIn, async (req, res, next) => {
  try {
    const result = await Posts.findAll();
    if (result) {
      for (const post of result) {
        const result2 = await Posts.findOne({
          include: {
            model: Replys,
            where: {
              postId: post.id
            }
          }
        });

        if (result2) {
          post.replys = result2.replys;
        }
      }
      res.render("diary/texts", {
        posts: result,
        name: req.user
      });
    }
  } catch (error) {
    console.log(error);
    console.log("일기장 보기 실패");
    return res.redirect("./error");
  }
});
router.get("/secret", isLoggedIn, tokenCheck, async (req, res, next) => {
  try {
    const result = await Posts.findAll();
    if (result) {
      for (const post of result) {
        const result2 = await Posts.findOne({
          include: {
            model: Replys,
            where: {
              postId: post.id
            }
          }
        });

        if (result2) {
          post.replys = result2.replys;
        }
      }
      res.render("diary/secret", {
        posts: result,
        name: req.user
      });
    }
  } catch (error) {
    console.log(error);
    console.log("일기장 보기 실패");
    return res.redirect("./error");
  }
});
router.get("/edit/:id", isLoggedIn, async (req, res, next) => {
  const postID = req.params.id;

  try {
    const result = await Posts.findOne({
      where: { id: postID }
    });

    if (result) {
      console.log("asndfjksdnfaknflksd");
      console.log(result);
      res.render("diary/edit", {
        post: result
      });
    }
  } catch (error) {
    console.log(error);
    console.log("데이터 조회 실패");
    return res.redirect("./error");
  }
});

router.post("/edit/:id", isLoggedIn, async (req, res, next) => {
  const postID = req.params.id;
  const body = req.body;

  try {
    const result = await Posts.update(
      {
        content: body.editTitle
      },
      {
        where: { id: postID }
      }
    );

    if (result) {
      console.log("데이터 수정 완료");
      res.redirect("/diary/texts");
    }
  } catch (error) {
    console.log("데이터 수정 실패");
  }
});

router.post("/delete/:id", isLoggedIn, async (req, res, next) => {
  const postID = req.params.id;

  try {
    const result = await Posts.destroy({
      where: { id: postID }
    });

    if (result) {
      res.redirect("/diary/texts");
    }
  } catch (error) {
    console.log("데이터 삭제 실패");
  }
});

//댓글

router.post("/reply-delete/:id", isLoggedIn, async (req, res, next) => {
  const postID = req.params.id;

  try {
    const result = await Replys.destroy({
      where: { id: postID }
    });

    if (result) {
      res.redirect("/diary/texts");
    }
  } catch (error) {
    console.log("댓글 삭제 실패");
  }
});

router.post("/reply/:postID", async (req, res, next) => {
  const postID = req.params.postID;
  const body = req.body;

  try {
    const result = await Replys.create({
      postId: postID,
      email: req.user,
      comment: body.replyContent
    });

    if (result) {
      res.redirect("/diary/texts#con" + postID);
    }
  } catch (error) {
    console.log("댓글 추가 실패");
    console.log(error);
  }
});

// const upload = multer({
//   storage: multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, "public/images/");
//     },
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
//     }
//   }),
//   limits: { fileSize: 5 * 1024 * 1024 }
// });

module.exports = router;
