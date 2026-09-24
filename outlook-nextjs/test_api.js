const data = {
  name: "Test User",
  rating: 5,
  comment: "Great product!",
  location: "Hyderabad",
  product: "UPVC Window"
};

fetch('http://localhost:3000/api/reviews', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(async res => {
  const text = await res.text();
  console.log("HTTP STATUS:", res.status);
  console.log("RESPONSE BODY:", text);
})
.catch(err => console.error("FETCH ERROR:", err));
