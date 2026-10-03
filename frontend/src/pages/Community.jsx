import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../App.css";

function Community() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});

  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const currentUserId = currentUser
    ? String(currentUser.id || currentUser._id || "")
    : "";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setError("");

      const response = await API.get("/community");
      setPosts(response.data);

      response.data.forEach((post) => {
        fetchComments(post._id);
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load community posts."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    try {
      const response = await API.get(
        `/comments/post/${postId}`
      );

      setComments((current) => ({
        ...current,
        [postId]: response.data,
      }));
    } catch (error) {
      console.error("Unable to load comments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Please write something before posting.");
      return;
    }

    try {
      setPosting(true);
      setError("");

      await API.post("/community", {
        content: content.trim(),
      });

      setContent("");
      await fetchPosts();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to create post."
      );
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await API.put(
        `/community/${postId}/like`
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post._id === postId ? response.data : post
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to update like."
      );
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/community/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );

      setComments((current) => {
        const updated = { ...current };
        delete updated[postId];
        return updated;
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete post."
      );
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentText((current) => ({
      ...current,
      [postId]: value,
    }));
  };

  const handleAddComment = async (postId) => {
    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      await API.post(`/comments/post/${postId}`, {
        content: text,
      });

      setCommentText((current) => ({
        ...current,
        [postId]: "",
      }));

      await fetchComments(postId);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to add comment."
      );
    }
  };

  const handleDeleteComment = async (
    commentId,
    postId
  ) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    try {
      await API.delete(`/comments/${commentId}`);

      setComments((current) => ({
        ...current,
        [postId]: (current[postId] || []).filter(
          (comment) => comment._id !== commentId
        ),
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to delete comment."
      );
    }
  };

  const hasLiked = (post) => {
    if (!currentUserId || !post.likes) return false;

    return post.likes.some(
      (id) => String(id) === currentUserId
    );
  };

  const canDeleteComment = (comment) => {
    if (!currentUser) return false;

    if (currentUser.role === "admin") {
      return true;
    }

    const commentAuthorId = String(
      comment.author?._id ||
        comment.author?.id ||
        ""
    );

    return currentUserId === commentAuthorId;
  };

  const canDeletePost = (post) => {
    if (!currentUser) return false;

    if (currentUser.role === "admin") {
      return true;
    }

    const postAuthorId = String(
      post.author?._id ||
        post.author?.id ||
        ""
    );

    return currentUserId === postAuthorId;
  };

  return (
    <div className="content-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">

          <Link
            to="/student-dashboard"
            className="logo"
          >
            UniGo
          </Link>

          <div className="nav-links">
            <Link to="/student-dashboard">
              Dashboard
            </Link>

            <Link to="/announcements">
              Announcements
            </Link>

            <Link to="/events">
              Events
            </Link>

            <Link to="/lost-found">
              Lost & Found
            </Link>

            <Link to="/complaints">
              Complaints
            </Link>
          </div>

        </div>
      </nav>

      <main className="content-container">

        {/* PAGE HEADER */}
        <div className="page-header community-page-header">

        <div>
          <h1>Community</h1>

          <p>
          Connect, share and communicate with your
          campus community.
          </p>
        </div>

        <Link
          to="/student-dashboard"
          className="back-dashboard-link"
        >
          ← Dashboard
        </Link>

        </div>

        {/* CREATE POST */}
        <div className="community-create-card">

          <h2>Create a Post</h2>

          <p className="card-description">
            Share an update, ask a question, or start a
            conversation with your campus community.
          </p>

          <form onSubmit={handleSubmit}>

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="What's happening on campus?"
              rows="4"
              maxLength="500"
            />

            <div className="community-form-footer">

              <span>
                {content.length}/500
              </span>

              <button
                type="submit"
                className="primary-btn"
                disabled={posting}
              >
                {posting
                  ? "Posting..."
                  : "Post"}
              </button>

            </div>

          </form>

        </div>

        {/* POSTS */}
        <section className="community-posts">

          <div className="section-heading">
            <h2>Community Posts</h2>
            <p>
              See what students are sharing on campus.
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">

              <h3>No posts yet</h3>

              <p>
                Be the first student to start a
                conversation.
              </p>

            </div>
          ) : (
            posts.map((post) => {

              const postComments =
                comments[post._id] || [];

              return (
                <article
                  className="community-post-card"
                  key={post._id}
                >

                  {/* POST HEADER */}
                  <div className="post-header">

                    <div>
                      <h3>
                        {post.author?.name ||
                          "Student"}
                      </h3>

                      <span>
                        {post.author?.course ||
                          "Student"}
                      </span>
                    </div>

                    {canDeletePost(post) && (
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          handleDeletePost(
                            post._id
                          )
                        }
                      >
                        Delete
                      </button>
                    )}

                  </div>

                  {/* POST CONTENT */}
                  <p className="post-content">
                    {post.content}
                  </p>

                  {/* POST ACTIONS */}
                  <div className="post-actions">

                    <button
                      type="button"
                      className={
                        hasLiked(post)
                          ? "like-btn liked"
                          : "like-btn"
                      }
                      onClick={() =>
                        handleLike(post._id)
                      }
                    >
                      {hasLiked(post)
                        ? "♥"
                        : "♡"}{" "}
                      {post.likes?.length || 0} Likes
                    </button>

                    <span>
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                  {/* COMMENTS */}
                  <div className="comments-section">

                    <h4>
                      Comments (
                      {postComments.length})
                    </h4>

                    {postComments.length === 0 ? (
                      <p className="no-comments">
                        No comments yet.
                      </p>
                    ) : (
                      <div className="comments-list">

                        {postComments.map(
                          (comment) => (
                            <div
                              className="comment-item"
                              key={comment._id}
                            >

                              <div className="comment-content">

                                <strong>
                                  {comment.author?.name ||
                                    "Student"}
                                </strong>

                                <p>
                                  {comment.content}
                                </p>

                              </div>

                              {canDeleteComment(
                                comment
                              ) && (
                                <button
                                  type="button"
                                  className="comment-delete-btn"
                                  onClick={() =>
                                    handleDeleteComment(
                                      comment._id,
                                      post._id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              )}

                            </div>
                          )
                        )}

                      </div>
                    )}

                    {/* COMMENT FORM */}
                    <div className="comment-form">

                      <input
                        type="text"
                        value={
                          commentText[
                            post._id
                          ] || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(
                            post._id,
                            e.target.value
                          )
                        }
                        placeholder="Write a comment..."
                        maxLength="300"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleAddComment(
                            post._id
                          )
                        }
                      >
                        Comment
                      </button>

                    </div>

                  </div>

                </article>
              );
            })
          )}

        </section>

      </main>
    </div>
  );
}

export default Community;