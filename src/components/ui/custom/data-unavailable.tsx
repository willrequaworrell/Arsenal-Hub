
type DataUnavailableProps = {
  message?: string
}


const DataUnavailable = ({message}: DataUnavailableProps) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <p className="text-sm text-center text-slate-600 italic">
        {message || "Data unavailable"}
      </p>
    </div>
  )
}

export default DataUnavailable
