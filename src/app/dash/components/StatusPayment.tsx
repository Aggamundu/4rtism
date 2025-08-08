export default function StatusPayment({ name }: { name: string }) {
  const style = (name: string) => {
    switch (name) {
      case "Request":
        return "bg-gradient-to-b from-custom-purple to-custom-brown";
      case "Pending":
        return "bg-custom-pink";
      case "WIP":
        return "bg-gradient-to-r from-custom-accent to-custom-darkAccent";
      case "Approval":
        return "bg-custom-green";
      case "Completed":
        return "bg-gradient-to-r from-custom-accent to-custom-darkAccent";
      case "Unpaid":
        return "bg-custom-orange";
      case "Paid":
        return "bg-custom-jade";
      default:
        return "bg-red";
    }
  }
  return (
    <div className={`${style(name)} flex justify-center items-center rounded-card w-[65%] h-[80%] py-[1%] text-center text-white text-base`}>
      {name}
    </div>
  )
}