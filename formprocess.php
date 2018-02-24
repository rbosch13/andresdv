<?php

$toEmail   = "andresdv@gmail.com"; //Replace it recipient email address
$subject   = 'Message from My Website'; //Subject line for emails

//Let's clean harmful characters from raw POST data using PHP Sanitize filters.
$name        = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
$email       = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
$message     = filter_var($_POST["text"], FILTER_SANITIZE_STRING);

//Let's put additional php validation here
if(strlen($name)<1) // If length is less than 1 we will throw an HTTP error.
{
    header('HTTP/1.1 500 Name Field Empty');
    exit();
}
//similar validation applies to all data, unless you want to replace with some other strong validation.
if(strlen($email)<1)
{
    header('HTTP/1.1 500 Email Field Empty');
    exit();
}
if(strlen($message)<1)
{
    header('HTTP/1.1 500 Message Field Empty');
    exit();
}

//Finally we can proceed with PHP email.
$headers = 'From: '.$email.'' . "\r\n" .
'Reply-To: '.$email.'' . "\r\n" .
'X-Mailer: PHP/' . phpversion();

@$sentMail = mail($toEmail, $subject, $message ."\r\n"."\r\n".' - '.$name, $headers);

if(!$sentMail)
{
    header('HTTP/1.1 500 Could not send mail! Sorry..');
    exit();
}else{
    echo '<h2>Hi '.$name.', Thank you for your email</h2>
    <p>Your email has already arrived in my Inbox, all I need to do is Check it..
    <br />Good day.</p>';
}
?>
