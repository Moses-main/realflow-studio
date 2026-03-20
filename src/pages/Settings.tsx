import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette,
  Globe, Wallet, Key, HelpCircle, ExternalLink, Check, Copy, Loader2, ArrowUpRight, ArrowDownLeft, Clock, BadgeCheck, FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ProfileForm {
  username: string;
  email: string;
  bio: string;
}

interface Transaction {
  hash: string;
  type: "deploy" | "mint" | "transfer" | "swap";
  amount: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  description: string;
}

const mockTransactions: Transaction[] = [
  { hash: "0x8f2e9...4a7b1", type: "deploy", amount: "0.023 MATIC", timestamp: "2 mins ago", status: "success", description: "MarketplaceFactory deployed" },
  { hash: "0x3c4d5...9e2f0", type: "mint", amount: "100 ERC-1155", timestamp: "15 mins ago", status: "success", description: "Tokenized Lagos Property" },
  { hash: "0x7b8c9...1d3e4", type: "transfer", amount: "0.005 MATIC", timestamp: "1 hour ago", status: "success", description: "Storage deposit" },
  { hash: "0x2a3b4...5c6d7", type: "swap", amount: "50 ERC-1155", timestamp: "3 hours ago", status: "success", description: "Fraction purchased" },
  { hash: "0x1x2y3...8z9w0", type: "deploy", amount: "0.021 MATIC", timestamp: "1 day ago", status: "success", description: "RWATokenizer deployed" },
];

const STORAGE_KEY = "realflow-user-profile";
const MOCK_MODE_KEY = "realflow-mock-mode";

const Settings = () => {
  const { user, connectWallet, disconnectWallet } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trades: true,
    marketing: false,
  });
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<ProfileForm>({
    username: "",
    email: "",
    bio: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [mockMode, setMockMode] = useState(() => {
    const saved = localStorage.getItem(MOCK_MODE_KEY);
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem(MOCK_MODE_KEY, String(mockMode));
  }, [mockMode]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to load profile:", e);
      }
    }
  }, []);

  const handleProfileChange = (field: keyof ProfileForm, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSaveProfile = async () => {
    if (!profile.username.trim()) {
      toast({
        title: "Validation Error",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }

    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setHasChanges(false);
      toast({
        title: "Success",
        description: "Profile saved successfully",
      });
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyAddress = () => {
    if (user.address) {
      navigator.clipboard.writeText(user.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center">
          <h1 className="text-lg font-semibold lg:hidden">Settings</h1>
          <h1 className="hidden lg:block text-xl font-semibold">Settings</h1>
        </header>

        <div className="p-4 lg:p-8">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 h-auto p-1">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="gap-2">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Manage your account information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {user.address ? `${user.address.slice(2, 4)}` : "?"}
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "Not Connected"}
                      </p>
                      <p className="text-sm text-muted-foreground">Polygon Amoy</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        placeholder="Enter username"
                        value={profile.username}
                        onChange={(e) => handleProfileChange("username", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter email"
                        value={profile.email}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Tell us about yourself"
                      value={profile.bio}
                      onChange={(e) => handleProfileChange("bio", e.target.value)}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isSaving || !hasChanges}>
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Developer Options</CardTitle>
                  <CardDescription>Options for testing and development</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mockMode ? "bg-amber-500/10" : "bg-muted"}`}>
                        <FlaskConical className={`w-5 h-5 ${mockMode ? "text-amber-500" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">Mock Data Mode</p>
                        <p className="text-sm text-muted-foreground">Use simulated data instead of live blockchain</p>
                      </div>
                    </div>
                    <Switch 
                      checked={mockMode}
                      onCheckedChange={(checked) => {
                        setMockMode(checked);
                        toast({
                          title: checked ? "Mock Mode Enabled" : "Mock Mode Disabled",
                          description: checked 
                            ? "App will use simulated data for testing" 
                            : "App will connect to live blockchain",
                        });
                      }}
                    />
                  </div>
                  {mockMode && (
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-sm text-amber-500 font-medium mb-1">Mock Mode Active</p>
                      <p className="text-xs text-amber-500/80">
                        All marketplace data, transactions, and wallet balances are simulated for testing purposes.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Wallet</CardTitle>
                  <CardDescription>Manage your connected wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.isWalletConnected ? (
                    <>
                      <div className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium capitalize">{user.walletType || "Wallet"}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {user.address}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={copyAddress}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => window.open(`https://amoy.polygonscan.com/address/${user.address}`, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Explorer
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="flex-1"
                          onClick={disconnectWallet}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No wallet connected</p>
                      <Button onClick={connectWallet}>Connect Wallet</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View your past transactions on Polygon Amoy</CardDescription>
                </CardHeader>
                <CardContent>
                  {mockTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {mockTransactions.map((tx) => (
                        <div 
                          key={tx.hash}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-secondary/30 transition-colors cursor-pointer"
                          onClick={() => window.open(`https://amoy.polygonscan.com/tx/${tx.hash}`, "_blank")}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            tx.type === "deploy" ? "bg-primary/10" :
                            tx.type === "mint" ? "bg-accent/10" :
                            tx.type === "transfer" ? "bg-amber-500/10" : "bg-green-500/10"
                          }`}>
                            {tx.type === "deploy" ? <ArrowUpRight className="w-4 h-4 text-primary" /> :
                             tx.type === "mint" ? <ArrowUpRight className="w-4 h-4 text-accent" /> :
                             tx.type === "transfer" ? <ArrowDownLeft className="w-4 h-4 text-amber-500" /> :
                             <ArrowUpRight className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm truncate">{tx.description}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                                tx.status === "success" ? "bg-primary/10 text-primary" :
                                tx.status === "pending" ? "bg-amber-500/10 text-amber-500" :
                                "bg-destructive/10 text-destructive"
                              }`}>
                                {tx.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="font-mono">{tx.hash}</span>
                              <span>•</span>
                              <span>{tx.amount}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {tx.timestamp}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => user.address && window.open(`https://amoy.polygonscan.com/address/${user.address}`, "_blank")}
                      >
                        View All on Explorer
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contract Settings</CardTitle>
                  <CardDescription>Configure deployed contracts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>RWATokenizer Address</Label>
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <BadgeCheck className="w-4 h-4" />
                        Verified
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value="0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be" 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" onClick={copyAddress}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" onClick={() => window.open("https://amoy.polygonscan.com/address/0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be#contracts", "_blank")}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>MarketplaceFactory Address</Label>
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <BadgeCheck className="w-4 h-4" />
                        Verified
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value="0x802A6843516f52144b3F1D04E5447A085d34aF37" 
                        readOnly 
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" onClick={copyAddress}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                      <Button variant="outline" onClick={() => window.open("https://amoy.polygonscan.com/address/0x802A6843516f52144b3F1D04E5447A085d34aF37#contracts", "_blank")}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Select defaultValue="amoy">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amoy">Polygon Amoy (Testnet)</SelectItem>
                        <SelectItem value="mainnet">Polygon Mainnet</SelectItem>
                        <SelectItem value="sepolia">Sepolia (Testnet)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications(n => ({...n, email: checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications(n => ({...n, push: checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Trade Alerts</p>
                        <p className="text-sm text-muted-foreground">Notifications for trades & transactions</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.trades}
                      onCheckedChange={(checked) => setNotifications(n => ({...n, trades: checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Marketing</p>
                        <p className="text-sm text-muted-foreground">News, tips, and promotional content</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.marketing}
                      onCheckedChange={(checked) => setNotifications(n => ({...n, marketing: checked}))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency Display</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="ars">ARS ($)</SelectItem>
                        <SelectItem value="ngn">NGN (₦)</SelectItem>
                        <SelectItem value="mxn">MXN ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Documentation
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      API Keys
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Settings;
