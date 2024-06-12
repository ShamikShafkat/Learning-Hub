import smtplib
from email.utils import parseaddr
from validate_email import validate_email


def verify_email_address(email):
    print(f"email = {email}")
    is_valid = validate_email(email_address=email,
                                    check_format=True,
                                    check_blacklist=True,
                                    check_dns=True,
                                    dns_timeout=10,
                                    check_smtp=True,
                                    smtp_timeout=10,
                                    smtp_helo_host='smtp.gmail.com',
                                    smtp_from_address='shamik.shafkat@gmail.com',
                                    smtp_skip_tls=False,
                                    smtp_tls_context=None,
                                    smtp_debug=False,
                            )
    return is_valid