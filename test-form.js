async function test() {
  const res = await fetch("https://formspree.io/f/mbdzkbea", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "test", email: "test@example.com", message: "test msg" }),
  });
  console.log("res.ok:", res.ok);
  console.log("res.status:", res.status);
  const text = await res.text();
  console.log("text:", text.slice(0, 100));
}
test();
