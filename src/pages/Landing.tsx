
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, FileText, Download } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const handleLoginSignup = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Lecture Lens
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Transform your lectures into searchable transcripts and summaries. 
            Record, transcribe, and organize your academic content effortlessly.
          </p>
          
          {/* Login/Signup Button */}
          <Button 
            onClick={handleLoginSignup}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 transition-smooth text-lg px-8 py-3"
          >
            Login / Sign Up
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <Mic className="h-12 w-12 text-white mx-auto mb-2" />
              <CardTitle className="text-white">Record Audio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Capture lectures with high-quality audio recording directly in your browser
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 text-white mx-auto mb-2" />
              <CardTitle className="text-white">Auto Transcribe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Get accurate transcriptions and intelligent summaries of your recordings
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <Download className="h-12 w-12 text-white mx-auto mb-2" />
              <CardTitle className="text-white">Export PDFs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 text-center">
                Download your transcripts and summaries as formatted PDF documents
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;
