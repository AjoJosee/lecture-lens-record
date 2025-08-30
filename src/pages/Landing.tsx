import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, BookOpen, FileText, Download } from "lucide-react";

const Landing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (action: 'login' | 'signup') => {
    setIsLoading(true);
    // Simulate auth process
    await new Promise(resolve => setTimeout(resolve, 1000));
    localStorage.setItem('user', JSON.stringify({ name: 'Student User', email: 'student@example.com' }));
    navigate('/dashboard');
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
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Transform your lectures into searchable transcripts and summaries. 
            Record, transcribe, and organize your academic content effortlessly.
          </p>
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

        {/* Auth Card */}
        <div className="max-w-md mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Get Started</CardTitle>
              <CardDescription>
                Sign in to access your lecture transcripts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="student@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-primary-hover transition-smooth"
                    onClick={() => handleAuth('login')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input id="email-signup" type="email" placeholder="student@university.edu" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input id="password-signup" type="password" />
                  </div>
                  <Button 
                    className="w-full bg-gradient-primary hover:bg-primary-hover transition-smooth"
                    onClick={() => handleAuth('signup')}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;