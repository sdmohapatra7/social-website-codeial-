{
    //method to submit the form data foe new post using AJAX
    let createPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/post/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#post-list-containner>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    // console.log(data);
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }
    //method to create a post In DOM
    let newPostDom = function (post) {
        return $(`<li id="post-${post._id}">
        <p>
            
            <small>
                <a class="delete-post-button" href="post/destroy/${post._id}"> X </a>
            </small>
            
            ${post.content}
        <br>
        <small>
        ${post.user.name}
        </small>
        </p>
        <div class="post-comments">
            
                <form action="comments/create" method="post">
                    <input type="text" name="content" placeholder="Type here to add comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
            
            <div class="post-comments-list">
                <ul id="post-comments-${post._id}">
                </ul>
            </div>
        </div>
    </li>`)
    }

    //method to delete a post from Dom
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type : 'get',
                url : $(deleteLink).prop('href'),
                success : function(data){
                    $(`#post-${data.post_id}`).remove();
                },
                error : function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    createPost();
}