import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch('/allpost', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        postId,
        text
      })
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt')
      }
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5>
              <span style={{ fontWeight: '750' }}>{item.postedBy.name}</span>{' '}
              {item.postedBy._id == state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: 'right'
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  <button className="delete">Delete</button>{' '}
                </i>
              )}
            </h5>

            <div className="card-image">
              <img src={item.photo} />
            </div>

            <div>
              <h6 className="captions">
                <span style={{ fontWeight: '750' }}>{item.title}</span>
              </h6>
              <p className="captions">
                <span style={{ fontWeight: '500' }}>{item.body}</span>
              </p>

              {(item.postedBy._id == state._id &&
                item.comments.map((record) => {
                  return (
                    <h6 key={record._id}>
                      <span style={{ fontWeight: '500' }}>
                        {record.postedBy.name}
                      </span>{' '}
                      {record.text}
                    </h6>
                  );
                })) ||
                (!(item.postedBy._id == state._id) &&
                  item.comments.map((record) => {
                    return (
                      <h6 key={record._id}>
                        <span style={{ fontWeight: '500' }}>
                          {(record.postedBy._id == item.postedBy._id ||
                            record.postedBy._id == state._id) &&
                            record.postedBy.name}
                        </span>{' '}
                        {(record.postedBy._id == item.postedBy._id ||
                          record.postedBy._id == state._id) &&
                          record.text}
                      </h6>
                    );
                  }))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input
                  type="text"
                  placeholder="Private comment. Please add description to claim."
                />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
