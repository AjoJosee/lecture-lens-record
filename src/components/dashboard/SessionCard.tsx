
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";

interface SessionData {
  id: number;
  title: string;
  date: string;
  duration: number;
  summary: string;
}

interface SessionCardProps {
  session: SessionData;
  onClick: () => void;
}

const SessionCard = ({ session, onClick }: SessionCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-primary/5 border-primary/20 hover:border-primary/40 hover:scale-[1.02] hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-primary">{session.title}</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(session.duration)}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm text-primary/70">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(session.date)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {session.summary}
        </p>
      </CardContent>
    </Card>
  );
};

export default SessionCard;
