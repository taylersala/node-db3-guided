const db = require('../../data/db-config.js')

module.exports = {
  findPosts,
  find,
  findById,
  add,
  remove
}

async function findPosts(user_id) {
  const rows = await db('posts as p')
  .select('p.id as posts_id', 'contents', 'username')
  .join('users as u', 'p.user_id', '=', 'u.id')
  .where('user_id', user_id)

  console.log(rows)
  return rows
  /*
    Implement so it resolves this structure:

    [
      {
          "post_id": 10,
          "contents": "Trusting everyone is...",
          "username": "seneca"
      },
      etc
    ]
  */
}

async function find() {
  const rows = await db('users as u')
  .leftJoin('posts as p', 'u.id', '=', 'p.user_id')
  .count('p.id as post_count')
  .groupBy('u.id')
  .select('u.id as user_id', 'username')
  return rows
  
  

  // select 
//     u.id as user_id,
//     username,
//     count(p.id) as post_count
// from users as u
// left join posts as p
//     on u.id = p.user_id
//     group by u.id;
  /*
    Improve so it resolves this structure:

    [
        {
            "user_id": 1,
            "username": "lao_tzu",
            "post_count": 6
        },
        {
            "user_id": 2,
            "username": "socrates",
            "post_count": 3
        },
        etc
    ]
  */
}

async function findById(id) {
  /*
    Improve so it resolves this structure:

    {
      "user_id": 2,
      "username": "socrates"
      "posts": [
        {
          "post_id": 7,
          "contents": "Beware of the barrenness of a busy life."
        },
        etc
      ]
    }
  */
    const rows = await db('users as u')
    .leftJoin('posts as p', 'u.id', 'p.user_id')
    .select(
      'u.id as user_id',
      'u.username',
      'p.id as post_id',
      'p.contents',
    )
    .where('u.id', id)
  let result = { posts: [] }
  for (let record of rows) {
    if (!result.username) {
      result.user_id = record.user_id
      result.username = record.username
    }
    if (record.post_id) {
      result.posts.push({
        contents: record.contents,
        post_id: record.post_id,
      })
    }
  }
  return result
}

function add(user) {
  return db('users')
    .insert(user)
    .then(([id]) => { // eslint-disable-line
      return findById(id)
    })
}

function remove(id) {
  // returns removed count
  return db('users').where({ id }).del()
}
