export default function GreenButton({ text }: { text: string }) {
    return (
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            {text}
        </button>
    )
}