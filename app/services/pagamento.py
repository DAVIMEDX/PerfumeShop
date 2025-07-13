import requests

MERCADO_PAGO_TOKEN = "APP_USR-593253950239496-071215-8e178141c9ad72d043e3237e29c4cdfd-295454225"  # Troque pelo seu token real

HEADERS = {
    "Authorization": f"Bearer {MERCADO_PAGO_TOKEN}",
    "Content-Type": "application/json"
}

def gerar_pix(valor: float, descricao: str, email: str):
    url = "https://api.mercadopago.com/v1/payments"
    payload = {
        "transaction_amount": valor,
        "description": descricao,
        "payment_method_id": "pix",
        "payer": {
        "email": email
        }
    }
    response = requests.post(url, json=payload, headers=HEADERS)
    return response.json()
    
def verificar_status(payment_id: str):
    url = f"https://api.mercadopago.com/v1/payments/{payment_id}"
    response = requests.get(url, headers=HEADERS)
    return response.json()
