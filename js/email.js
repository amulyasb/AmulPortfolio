function sendMail(){
    const parms = {
        name : document.querySelector("#name").value,
        email : document.querySelector("#email").value,
        message : document.querySelector("#message").value,
        subject : document.querySelector("#subject").value,
    }

        emailjs.send("service_50lxbgs", "template_b39bd3n", parms)
        .then(() => {
            alert("Contact Form Sent Successfully, Thank You!");
            location.reload(); 
        })
        .catch(() => {
            alert("Unable to send Contact Form");
            location.reload(); 
        });

    // emailjs.send("service_50lxbgs","template_b39bd3n",parms).then(() => alert("Contact Form Sent Successfully, Thank You!").catch(() => alert("Unable to sent Contact Form")));
}