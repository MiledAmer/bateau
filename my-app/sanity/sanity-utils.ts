import { createClient } from "@sanity/client";
import { Boat } from "../types/boat";
import clientConfig from "./config/client-config";
import SanityClient from "next-sanity-client";
import { Reservation } from "../types/reservation";
import { Client } from "../types/client";

export async function getBoats(): Promise<Boat[]> {
  const client = new SanityClient(clientConfig);

  return client.fetch({
    query: `*[_type == "boat"]{
      _id,
      _createdAt,
      name,
      type,
      diameter,
      rooms,
      capacity,
      "images": images[].asset->url,
      description
    }`,
    config: {
      cache: "no-cache",
    },
  });
}

export async function getClient(name: string): Promise<Client> {
  const client = new SanityClient(clientConfig);

  return client.fetch({
    query: `*[_type == "reservation" && name == $name ][0]{
      _id,
      
    }`,
    params: {
      name: name,
    },
    config: {
      cache: "no-cache",
    },
  });
}

export async function getClients(): Promise<Client[]> {
  const client = new SanityClient(clientConfig);
  return client.fetch({
    query: `*[_type == "reservation"]{
      _id,
      
    }`,
    config: {
      cache: "no-cache",
    },
  });
}

export const getReservationById = async (id: string) => {
  const client = createClient(clientConfig);
  try {
    const reservation = await client.getDocument(id);
    return reservation;
  } catch (error) {
    console.error('Error fetching reservation:', error);
    throw error;
  }
};

export const verifyReservation = async (id: string) => {
  const client = createClient(clientConfig);
  try {
    const updatedReservation = await client.patch(id)
      .set({ isValidEmail: true })
      .commit();
    return updatedReservation;
  } catch (error) {
    console.error('Error verifying reservation:', error);
    throw error;
  }
};
export async function createReservation(
  data: Reservation
): Promise<Reservation> {
  const client = createClient(clientConfig);

  try {
    const document = {
      _type: "reservation",
      ...data,
    };

    const response: Reservation = await client.create<Reservation>(document);
    return response;
  } catch (error: any) {
    console.error("Error creating reservation:", error.message);
    throw error;
  }
}
