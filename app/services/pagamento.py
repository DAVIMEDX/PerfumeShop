import requests

MERCADO_PAGO_TOKEN = "SEU_ACCESS_TOKEN_AQUI"  # Troque pelo seu token real

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
