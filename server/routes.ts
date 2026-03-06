import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.prices.list.path, async (req, res) => {
    try {
      const prices = await storage.getPrices();
      res.status(200).json(prices);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch prices" });
    }
  });

  return httpServer;
}
