import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import React from 'react';
// Skeleton loader with shimmer effect for tables
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex space-x-4 p-4"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </motion.div>
      ))}
    </div>
  );
}

// Card skeleton with shimmer effect
export function CardSkeleton() {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

// Chart skeleton with animated filling effect
export function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`w-full ${height} flex items-end justify-center space-x-2 p-4`}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="bg-gray-200 rounded-t"
          style={{ width: '20px' }}
          initial={{ height: 0 }}
          animate={{ height: Math.random() * 180 + 20 }}
          transition={{ 
            delay: i * 0.1, 
            duration: 0.8,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}

// Pie chart skeleton
export function PieChartSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div
        className="w-32 h-32 border-8 border-gray-200 rounded-full border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Spinner with label
export function LoadingSpinner({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-3">
      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Progress bar loader
export function ProgressLoader({ progress = 0, label = "Chargement des données..." }: { 
  progress?: number; 
  label?: string; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

// Module container with loading state
export function ModuleLoader({ isLoading, children }: { 
  isLoading: boolean; 
  children: React.ReactNode; 
}) {
  return (
    <motion.div
      key={isLoading ? 'loading' : 'loaded'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Shimmer effect for any content
export function ShimmerWrapper({ children, className = "" }: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ translateX: '100%' }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 0.5
        }}
      />
    </div>
  );
}

// Filters skeleton
export function FiltersSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Stats cards skeleton
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <CardSkeleton />
        </motion.div>
      ))}
    </div>
  );
}