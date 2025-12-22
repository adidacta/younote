"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, StickyNote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsData {
  totalNotebooks: number;
  totalPages: number;
  totalNotes: number;
  notebooks24h: number;
  pages24h: number;
  notes24h: number;
}

interface StatCardProps {
  title: string;
  total: number;
  recent: number;
  icon: React.ReactNode;
  iconColor: string;
}

function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

function StatCard({ title, total, recent, icon, iconColor }: StatCardProps) {
  const animatedTotal = useCountUp(total);
  const animatedRecent = useCountUp(recent, 1500);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`${iconColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{animatedTotal}</div>
        {recent > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-green-600 dark:text-green-400 font-medium">
              +{animatedRecent}
            </span>{" "}
            in last 24h
          </p>
        )}
        {recent === 0 && total > 0 && (
          <p className="text-xs text-muted-foreground mt-1">No new today</p>
        )}
        {total === 0 && (
          <p className="text-xs text-muted-foreground mt-1">Get started!</p>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsWidgets() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err instanceof Error ? err.message : "Failed to load stats");
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-4 w-4 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-32 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Notebooks"
        total={stats.totalNotebooks}
        recent={stats.notebooks24h}
        icon={<BookOpen className="h-4 w-4" />}
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        title="Pages"
        total={stats.totalPages}
        recent={stats.pages24h}
        icon={<FileText className="h-4 w-4" />}
        iconColor="text-purple-600 dark:text-purple-400"
      />
      <StatCard
        title="Notes"
        total={stats.totalNotes}
        recent={stats.notes24h}
        icon={<StickyNote className="h-4 w-4" />}
        iconColor="text-green-600 dark:text-green-400"
      />
    </div>
  );
}
