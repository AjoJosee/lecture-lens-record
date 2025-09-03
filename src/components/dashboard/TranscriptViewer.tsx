
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Clock, Calendar, Volume2, FileType } from "lucide-react";
import jsPDF from 'jspdf';
import AudioPlayer from './AudioPlayer';

interface SessionData {
  id: number;
  title: string;
  date: string;
  duration: number;
  transcript: string;
  summary: string;
  audioUrl?: string;
}

interface TranscriptViewerProps {
  session: SessionData;
}

const TranscriptViewer = ({ session }: TranscriptViewerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(session.title, 20, 20);
    
    // Add metadata
    doc.setFontSize(12);
    doc.text(`Date: ${formatDate(session.date)}`, 20, 35);
    doc.text(`Duration: ${formatTime(session.duration)}`, 20, 45);
    
    // Add summary
    doc.setFontSize(16);
    doc.text('Summary', 20, 65);
    doc.setFontSize(12);
    
    const summaryLines = doc.splitTextToSize(session.summary, 170);
    doc.text(summaryLines, 20, 75);
    
    // Add transcript
    doc.setFontSize(16);
    doc.text('Transcript', 20, 75 + (summaryLines.length * 5) + 20);
    doc.setFontSize(12);
    
    const transcriptLines = doc.splitTextToSize(session.transcript, 170);
    doc.text(transcriptLines, 20, 75 + (summaryLines.length * 5) + 35);
    
    doc.save(`${session.title.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Session Header */}
      <Card className="bg-gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="h-6 w-6 mr-2" />
                {session.title}
              </CardTitle>
              <CardDescription className="flex items-center space-x-4 mt-2">
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDate(session.date)}
                </span>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(session.duration)}
                </Badge>
              </CardDescription>
            </div>
            <Button onClick={downloadPDF} className="bg-accent hover:bg-accent/90">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Tabbed Content */}
      <Card>
        <Tabs defaultValue="summary" className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary" className="flex items-center gap-2">
                <FileType className="h-4 w-4" />
                Summary
              </TabsTrigger>
              <TabsTrigger value="transcript" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transcript
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Audio
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="summary" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {session.summary}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Full Transcript</h3>
                <ScrollArea className="h-96 w-full border rounded-md p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {session.transcript}
                  </p>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-0">
              {session.audioUrl ? (
                <AudioPlayer
                  audioUrl={session.audioUrl}
                  transcript={session.transcript}
                />
              ) : (
                <div className="text-center py-8">
                  <Volume2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No audio available for this session</p>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default TranscriptViewer;
