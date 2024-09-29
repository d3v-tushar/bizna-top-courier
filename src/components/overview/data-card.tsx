import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataCardProps {
  data: {
    title: string;
    period: 'week' | 'month' | 'year'; // Add more time periods if needed
    current: number;
    last: number;
  };
  children: React.ReactNode;
}

function calculateProgress(current: number, last: number, period: string) {
  if (last === 0) {
    return `No data for last ${period}`;
  }
  const progress = ((current - last) / last) * 100;
  const progressFormatted = Math.abs(progress).toFixed(2); // Formatting to 2 decimal places
  return `${progress >= 0 ? '+' : '-'} ${progressFormatted} % from last ${period}`;
}

export default function DataCard({ data, children }: DataCardProps) {
  const progress = calculateProgress(data.current, data.last, data.period);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{data.title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.current}</div>
        <p className="text-xs capitalize text-muted-foreground">{progress}</p>
      </CardContent>
    </Card>
  );
}
