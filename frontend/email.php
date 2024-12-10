<?php
if (isset($_POST['send'])) {
        $to = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);

        if(filter_var($to, FILTER_VALIDATE_EMAIL)) {
                $subject = "Game Deals Tracker Confirmation";
                $message = "Thank you for registering with Game Deals Tracker! We hope you enjoy your stay and happy deal hunting!";
                $headers = "From: no-reply@gdt.com" . "\r\n". "Content-Type: text/plain; charset=UTF-8";



                if(mail($to, $subject, $message, $headers)){
                        echo "Email sucessfully sent to $to";
                } else {
                        echo "Failed to send email, please try again.";
                }
        } else {
                echo "Invalid email address, please try again.";
        }
}



?>