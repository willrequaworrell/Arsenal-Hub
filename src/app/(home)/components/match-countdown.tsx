

const MatchCountdown = () => {
  return (
    <div className="flex justify-around">
      <div className="flex flex-col items-center font-bold">
        <p className="text-2xl">01</p>
        <p className="text-sm text-slate-600">Days</p>
      </div>
      <div className="flex flex-col items-center font-bold">
        <p className="text-2xl">20</p>
        <p className="text-sm text-slate-600">Hours</p>
      </div>
      <div className="flex flex-col items-center font-bold">
        <p className="text-2xl">24</p>
        <p className="text-sm text-slate-600">Mins</p>
      </div>
      <div className="flex flex-col items-center font-bold">
        <p className="text-2xl">08</p>
        <p className="text-sm text-slate-600">Secs</p>
      </div>
    </div>
  )
}

export default MatchCountdown