import { useNavigate } from "solid-app-router";
import { createEffect } from "solid-js";

// generate a random string with lowercase letters
const generateRandomId = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let id = "";
  for (let i = 0; i < 5; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
};
// thanks copilot

const IndexPage = () => {
  const navigate = useNavigate();

  createEffect(() => {
    const randomId = generateRandomId();
    navigate(`/${randomId}`, { replace: true });
  });

  return null;
};
export default IndexPage;