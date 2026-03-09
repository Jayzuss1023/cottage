import { ListingForm } from "@/components/forms/ListingForm";
import { Amenity } from "@/types/index";
import { sanityFetch } from "@/sanity/lib/live";
import { AMENITIES_QUERY } from "@/sanity/lib/queries/queries";

export default async function NewListingPage() {
  const { data: amenities } = await sanityFetch({
    query: AMENITIES_QUERY,
  });

  return (
    <div>
      <div>
        <h1>Create New Listing</h1>
        <p>Add a new property to your listings</p>
      </div>

      <ListingForm amenities={(amenities || []) as Amenity[]} />
    </div>
  );
}
