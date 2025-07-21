export type Form = {
  title: string;
  type: string;
  price: number;
  deliveryDays: number;
  description: string;
}
export type FormProps = {
  form: Form;
  setForm: (f: any) => void;
}