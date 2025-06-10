import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, interval, of, Subscription, switchMap } from 'rxjs';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { ChartDataPoint, LiveSubmissionData, SubmissionChartService } from '../../../core/services/submission-chart.service';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-submission-chart',
  imports: [CommonModule],
  templateUrl: './admin-submission-chart.component.html',
  styleUrl: './admin-submission-chart.component.css'
})
export class AdminSubmissionChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart!: Chart;
  private refreshSubscription!: Subscription;
  
  // Live data
  currentMinuteCount: number = 0;
  todayTotal: number = 0;
  lastUpdated: Date = new Date();
  isLoading: boolean = true;
  error: string | null = null;
  
  // Chart configuration
  chartData: ChartDataPoint[] = [];
  timeRange: number = 60; // minutes

  constructor(private submissionService: SubmissionChartService) {}

  ngOnInit(): void {
    this.initializeChart();
    this.startRealTimeUpdates();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: [],
        datasets: [{
          label: 'Submissions per Minute',
          data: [],
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#4f46e5',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          title: {
            display: true,
            text: 'Paper Submissions - Last 60 Minutes',
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#4f46e5',
            borderWidth: 1
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Number of Submissions'
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              stepSize: 1
            }
          }
        },
        animation: {
          duration: 750,
          easing: 'easeInOutQuart'
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private startRealTimeUpdates(): void {
    // Initial load
    this.loadChartData();
    
    // Update every second
    this.refreshSubscription = interval(1000).pipe(
      switchMap(() => this.submissionService.getLiveSubmissions()),
      catchError(error => {
        console.error('Error fetching live data:', error);
        this.error = 'Failed to fetch live data';
        return of(null);
      })
    ).subscribe(liveData => {
      if (liveData) {
        this.updateLiveData(liveData);
        this.error = null;
      }
    });

    // Update chart data every 30 seconds
    interval(30000).pipe(
      switchMap(() => this.submissionService.getSubmissionsByMinute(this.timeRange)),
      catchError(error => {
        console.error('Error fetching chart data:', error);
        return of([]);
      })
    ).subscribe(data => {
      if (data.length > 0) {
        this.updateChartData(data);
      }
    });
  }

  private loadChartData(): void {
    this.isLoading = true;
    this.submissionService.getSubmissionsByMinute(this.timeRange).subscribe({
      next: (data) => {
        this.updateChartData(data);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.error = 'Failed to load chart data';
        this.isLoading = false;
      }
    });
  }

  private updateChartData(data: ChartDataPoint[]): void {
    this.chartData = data;
    
    if (this.chart) {
      this.chart.data.labels = data.map(d => d.time);
      this.chart.data.datasets[0].data = data.map(d => d.count);
      this.chart.update('none'); // No animation for real-time updates
    }
  }

  private updateLiveData(data: LiveSubmissionData): void {
    this.currentMinuteCount = data.currentMinuteCount;
    this.todayTotal = data.todayTotal;
    this.lastUpdated = new Date(data.timestamp);
  }

  changeTimeRange(minutes: number): void {
    this.timeRange = minutes;
    this.loadChartData();
    
    // Update chart title
    if (this.chart) {
      this.chart.options.plugins!.title!.text = `Paper Submissions - Last ${minutes} Minutes`;
      this.chart.update();
    }
  }

  refreshData(): void {
    this.loadChartData();
  }
}
