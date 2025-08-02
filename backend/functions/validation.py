

def is_valid_input(input:str):
    valid_inputs = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM@._"
    for x in input:
        if x not in valid_inputs:
            return False

    return True



def is_valid_password(password:str):
    if len(password) < 8:
        return {"valid": False, "message": "طول رمز عبور حداقل باید 8 کاراکتر باشد"}

    if len(password) > 32:
        return {"valid": False, "message": "طول رمز عبور باید حداکثر 32 کاراکتر باشد"}

    if not is_valid_input(password):
        return {"valid": False, "message": "رمز عبور تنها می تواند شامل حروف انگلیسی بزرگ و کوچک اعداد . @ و _ باشد"}

    return {"valid": True, "message": ""}

def is_valid_phone(phone:str):
    if len(phone) != 11:
        return False

    if phone[0] != '0':
        return False

    valid_inputs = "1234567890"
    for x in phone:
        if x not in valid_inputs:
            return False

    return True

def is_persian(input):
    valid_inputs = " ژضصثقفغعهخحجچپشسیبلاتنمکگظطزرذدئوءأؤ"
    for x in input:
        if x not in valid_inputs:
            return False

    return True

def is_number(input):
    valid_inputs = "0123456789۰۱۲۳۴۵۶۷۸۹"
    for x in input:
        if x not in valid_inputs:
            return False

    return True

def is_Text(input):
    valid_inputs = "0123456789۰۱۲۳۴۵۶۷۸۹ qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM.؛،ژضصثقفغعهخحجچپشسیبلاتنمکگظطزرذدئوءأؤ"
    for x in input:
        if x not in valid_inputs:
            return False

    return True


