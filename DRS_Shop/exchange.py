import requests


def exchange_converter(money,source,destination):

    src=source
    dst=destination
    amount=money

    url=f"https://api.exchangerate-api.com/v4/latest/{src}"

    response=requests.get(url)

    data=response.json()

    rate=data["rates"][src]

    aSRC=amount/rate
    aDST=aSRC*data['rates'][dst]
    
    exchange=round(aDST,2)
    
    return exchange
    
    

    