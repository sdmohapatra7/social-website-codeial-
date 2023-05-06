{
    let createComments = function(){
        let newCommentFrom = $('#new-comment-form');
        newCommentFrom.submit(function(e){
            e.preventDefault();
            $.ajax({
                type: 'comment',
                url: '/comments/create',
                data: newCommentFrom.serialize(),
                success : function(data){
                    console.log(data);
                    let newComment = newCommentDom(data.data.post.comments);
                    
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create a comment in dom

}