type Props = {};

export default function WeatherDetails({}: Props) {
  return <div>WeatherDetails</div>;
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail(props: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold text-black/80"></div>
  );
}
