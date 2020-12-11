$('#formLogin').validate({
    rules: {
        username: {
            required: true,
            minlength: 5,
            maxlength: 50
        },
        password: {
            required: true,
        },
    },
    messages: {
        username: {
            required: 'Please enter your email to login.',
        },
        password: {
            required: 'Please enter your password to login.',
        },
    }
});
