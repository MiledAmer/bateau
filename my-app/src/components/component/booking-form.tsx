import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reservation } from "../../../types/reservation";
import { createReservation, getClient } from "../../../sanity/sanity-utils";
import { send } from "@/app/api/contact";
import { Client } from "../../../types/client";
import { url } from "@/lib/constants";

interface BookingFormProps {
  boat: string;
}

export function BookingForm(boat: BookingFormProps) {
  async function UpFrom(formData: FormData) {
    "use server";
    const reservation: Reservation = {
      boatName: boat.boat, // Set boatName based on your requirement
      name: formData.get("name") as string,
      phone: parseInt(formData.get("phone") as string),
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      guests: parseInt(formData.get("guests") as string),
      email: formData.get("email") as string,
      isValidEmail: false,
      message: formData.get("message") as string,
      isAccepted: false, // Set initial value as needed
    };
    createReservation(reservation);
    getClient(reservation.name).then((value: Client) => {
      send(reservation, `${url}/verify/${value._id}`);
    });
  }

  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button
          className="inline-flex h-10 items-center justify-center rounded-md
        bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow
        transition-colors hover:bg-gray-900/90 focus-visible:outline-none
        focus-visible:ring-1 focus-visible:ring-gray-950 hover:text-white
        disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50
        dark:text-gray-900 dark:hover:bg-gray-50/90
        dark:focus-visible:ring-gray-300"
          variant="outline"
        >
          Rent Now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Book Your Reservation</DialogTitle>
          <DialogTitle>{boat.boat}</DialogTitle>
          <DialogDescription>
            Fill out the form below to reserve your spot.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" action={UpFrom}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                defaultValue=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Enter your phone number"
                type="tel"
                defaultValue=""
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                defaultValue=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Reservation Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue=""
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                name="time"
                type="time"
                defaultValue=""
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guests">Guests</Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                min="1"
                placeholder="Number of guests"
                defaultValue=""
                required
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            The rental period is four hours.
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              className="min-h-[100px]"
              id="message"
              name="message"
              placeholder="Enter any additional details"
              defaultValue=""
            />
          </div>

          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
