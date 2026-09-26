import CartList from "./cart-list";
import Checkout from "./checkout";

export default function CheckoutContainer({ waiterId }: { waiterId: string }) {
  return (
    <div className="container mx-auto grid sm:grid-cols-[1fr_auto] gap-10 max-w-7xl items-start mt-[20px] px-4 sm:px-6 lg:px-8">
      <CartList />
      <Checkout waiterId={waiterId} />
    </div>
  );
}
