import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def send_mail(subject,body,to_email):
    user="drsprodavnica@gmail.com"
    password="ggej zkqq zkqv jhvq"
    
    message=MIMEMultipart()
    message["From"]=user
    message["To"]=to_email
    message["Subject"]=subject
    message.attach(MIMEText(body,'plain'))
    
    with smtplib.SMTP('smtp.gmail.com',587) as server:
        server.starttls()
        server.login(user,password)
        server.sendmail(user,to_email,message.as_string())
