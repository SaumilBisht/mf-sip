import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redis = new Redis(REDIS_URL);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

export const setKey = async (key: string, value: any, ttlSeconds?: number) => {
  const val = typeof value === "string" ? value : JSON.stringify(value);
  if (ttlSeconds) {
    await redis.set(key, val, "EX", ttlSeconds);
  } else {
    await redis.set(key, val);
  }
};

export const getKey = async (key: string) => {
  const val = await redis.get(key);
  if (!val) return null;
  try {
    return JSON.parse(val);
  } catch {
    return val;
  }
};

export const delKey = async (key: string) => {
  await redis.del(key);
};
