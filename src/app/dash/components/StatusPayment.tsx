export default function StatusPayment({ name }: { name: string }) {
  const style = (name: string) => {
    switch (name) {
      case "Request":
        return "bg-gradient-to-r from-custom-yellow to-custom-blue";
      case "Pending":
        return "bg-gradient-to-r from-custom-yellow from-0% via-custom-blue via-80% to-custom-darkblue to-100%";
      case "WIP":
        return "bg-gradient-to-r from-custom-yellow from-0% via-custom-blue via-50% to-custom-darkblue to-100%";
      case "Approval":
        return "bg-gradient-to-r from-custom-yellow from-0% via-custom-blue via-30% to-custom-darkblue to-100%";
      case "Completed":
        return "bg-gradient-to-r from-custom-blue to-custom-darkblue";
      case "Unpaid":
        return "bg-gradient-to-r from-custom-pink1 from-0% via-custom-pink2 via-50% to-custom-pink3 to-100%";
      // Alternative with custom CSS:
      // return "bg-gradient-to-r from-purple-400 from-20% via-pink-500 via-60% to-red-500 to-100%";
      case "Paid":
        return "bg-gradient-to-r from-custom-yellow to-custom-brown";
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