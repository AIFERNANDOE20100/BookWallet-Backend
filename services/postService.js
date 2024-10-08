const db = require("../config/dbConfig");
const Post = require("../models/postModel");

const getPostsService = async () => {
  try {
    const [rows] = await db.execute(
      `SELECT reviewed.review_id, 
              reviewed.book_id, 
              reviewed.user_id, 
              book.imageUrl, 
              book.title, 
              book.author, 
              reviewed.context, 
              reviewed.rating, 
              reviewed.date,
              user.username,
              COUNT(DISTINCT likes.user_id) AS likesCount,
              COUNT(DISTINCT comments.comment_id) AS commentsCount,
              COUNT(DISTINCT shares.share_id) AS sharesCount
       FROM reviewed
       INNER JOIN user ON reviewed.user_id = user.user_id
       INNER JOIN book ON reviewed.book_id = book.book_id
       LEFT JOIN likes ON likes.review_id = reviewed.review_id
       LEFT JOIN comments ON comments.review_id = reviewed.review_id
       LEFT JOIN shares ON shares.review_id = reviewed.review_id
       GROUP BY reviewed.review_id, 
                reviewed.book_id, 
                reviewed.user_id, 
                book.imageUrl, 
                book.title, 
                book.author, 
                reviewed.context, 
                reviewed.rating,
                reviewed.date, 
                user.username;`
    );

    return rows.map((row) => 
      new Post(
        row.review_id,
        row.book_id,
        row.user_id,
        row.imageUrl,
        row.title,
        row.author,
        row.context,
        row.rating,
        row.date,
        row.username,
        row.likesCount,
        row.commentsCount,
        row.sharesCount,
      )
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
};

module.exports = { getPostsService };






// const db = require("../config/dbConfig");
// const Post = require("../models/postModel");

// const getPosts = async (req, res) => {
//   try {
//     const [rows] = await db.execute(
//       `SELECT reviewed.review_id, 
//        reviewed.book_id, 
//        reviewed.user_id, 
//        book.imageUrl, 
//        book.title, 
//        book.author, 
//        reviewed.context, 
//        reviewed.rating, 
//        reviewed.date,
//        user.username,
//        COUNT(DISTINCT likes.user_id) AS likesCount,
//        COUNT(DISTINCT comments.comment_id) AS commentsCount,
//        COUNT(DISTINCT shares.share_id) AS sharesCount
// FROM reviewed
// INNER JOIN user ON reviewed.user_id = user.user_id
// INNER JOIN book ON reviewed.book_id = book.book_id
// LEFT JOIN likes ON likes.review_id = reviewed.review_id
// LEFT JOIN comments ON comments.review_id = reviewed.review_id
// LEFT JOIN shares ON shares.review_id = reviewed.review_id
// GROUP BY reviewed.review_id, reviewed.book_id, reviewed.user_id, book.imageUrl, book.title, book.author, reviewed.context, reviewed.rating,reviewed.date, user.username;
// `
//     );
//     const posts = rows.map(
//       (row) =>
//         new Post(
//           row.review_id,
//           row.book_id,
//           row.user_id,
//           row.imageUrl,
//           row.title,
//           row.author,
//           row.context,
//           row.rating,
//           row.date,
//           row.username,
//           row.likesCount,
//           row.commentsCount,
//           row.sharesCount,
//         )
//     );
//     console.log(posts);
//     res.json(posts);
//   } catch (error) {
//     console.error("Error fetching posts:", error); // Log the actual error
//     res.status(500).json({ error: "Failed to fetch posts" });
//   }
// };

// module.exports = { getPosts };
