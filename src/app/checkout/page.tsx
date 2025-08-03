"use client"

export default function CheckoutPage() {
  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 10.00,
          description: 'Art Commission',
          commissionId: 'test-123'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Failed to start checkout: ' + errorMessage);
    }
  }

  return (
    <div>
      <h1>Checkout</h1>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}