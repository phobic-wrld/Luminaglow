import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin";
import About from "./pages/About";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/collections/women" component={() => <CategoryPage category="women" />} />
      <Route path="/collections/men" component={() => <CategoryPage category="men" />} />
      <Route path="/collections/unisex" component={() => <CategoryPage category="unisex" />} />
      <Route path="/women" component={() => <CategoryPage category="women" />} />
      <Route path="/men" component={() => <CategoryPage category="men" />} />
      <Route path="/unisex" component={() => <CategoryPage category="unisex" />} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
