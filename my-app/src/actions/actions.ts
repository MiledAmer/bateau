"use server";

import { sendReservationMail, sendToAdminsMail } from "@/app/api/contact";
import {
  createMessage,
  createReservation,
  getClient,
  getMails,
} from "../../sanity/sanity-utils";
import { Reservation } from "../../types/reservation";
import { url } from "@/lib/constants";
import { Contact } from "../../types/Contact";

export async function UpFrom(boat: string, formData: FormData) {
  const mails = await getMails();
  const reservation: Reservation = {
    boatName: boat,
    name: formData.get("name") as string,
    phone: parseInt(formData.get("phone") as string),
    date: formData.get("date") as string,
    time: formData.get("time") as string,
    guests: parseInt(formData.get("guests") as string),
    email: formData.get("email") as string,
    isValidEmail: false,
    message: formData.get("message") as string,
    isAccepted: false,
    sended: false,
  };

  try {
    const createdReservation = await createReservation(reservation);
    const client = await getClient(createdReservation.name);

    if (!client) {
      return { error: "Client not found!" };
    }

    const result = await sendReservationMail(
      createdReservation,
      `${url}/verify/${client?._id}`
    );

    if (result?.error) {
      return { error: 'Something went wrong!' };
    }

    mails.forEach((data) => {
      sendToAdminsMail(data, createdReservation);
    });

    return { success: true };

  } catch (error) {
    return { error: "Something went wrong!" };
  }
}


export async function SendMessage(formData: FormData) {
  const data: Contact = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    message: formData.get("message") as string,
  };
  try {
    await createMessage(data);
  } catch (error) {
    return {
      error: "Something went wrong!",
    };
  }
}
