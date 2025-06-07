import {Component,ElementRef,OnDestroy,OnInit,ViewChild} from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Router } from '@angular/router';
import Chart, { ChartConfiguration, ChartType } from 'chart.js/auto';
import {ChartDataPoint,LiveSubmissionData,SubmissionChartService,} from '../../../core/services/submission-chart.service';
import { catchError, interval, of, Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-main',
  imports: [CommonModule],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.css',
})
export class AdminMainComponent implements OnInit, OnDestroy {
  userName: string = '';
  userCount: number = 0;
  courseCount: number = 0;
  examCount: number = 0;
  questionCount: number = 0;
  adminCount: number = 0;
  teacherCount: number = 0;
  studentCount: number = 0;

  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private submissionChartService: SubmissionChartService
  ) {}

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnInit(): void {
    this.me();
    this.getUserCount();
    this.getCourseCount();
    this.getExamCount();
    this.getQuestionCount();
    this.getAdminCount();
    this.getTeacherCount();
    this.getStudentCount();
    this.initializeChart();
    this.startRealTimeUpdates();
  }
  me() {
    this.authService.me().subscribe({
      next: (user) => {
        this.userName = user.name;
      },
      error: (error) => {
        console.error('Error fetching user data', error);
        alert('Error fetching user data. Please try again later.');
      },
    });
  }
  getUserCount() {
    this.dashboardService.getUserCount().subscribe({
      next: (count) => {
        this.userCount = count;
      },
      error: (error) => {
        console.error('Error fetching user count', error);
        alert('Error fetching user count. Please try again later.');
      },
    });
  }
  getCourseCount() {
    this.dashboardService.getCourseCount().subscribe({
      next: (count) => {
        this.courseCount = count;
      },
      error: (error) => {
        console.error('Error fetching course count', error);
        alert('Error fetching course count. Please try again later.');
      },
    });
  }
  getExamCount() {
    this.dashboardService.getExamCount().subscribe({
      next: (count) => {
        this.examCount = count;
      },
      error: (error) => {
        console.error('Error fetching exam count', error);
        alert('Error fetching exam count. Please try again later.');
      },
    });
  }
  getQuestionCount() {
    this.dashboardService.getQuestionCount().subscribe({
      next: (count) => {
        this.questionCount = count;
      },
      error: (error) => {
        console.error('Error fetching question count', error);
        alert('Error fetching question count. Please try again later.');
      },
    });
  }
  addNewUser() {
    this.router.navigate(['admin/add-user']);
  }
  createCourse() {
    this.router.navigate(['admin/create-course']);
  }

  getAdminCount() {
    this.dashboardService.getAdminCount().subscribe({
      next: (count) => {
        this.adminCount = count;
      },
      error: (error) => {
        console.error('Error fetching admin count', error);
        alert('Error fetching admin count. Please try again later.');
      }
    });
  }

  getTeacherCount() {
    this.dashboardService.getTeacherCount().subscribe({
      next: (count) => {
        this.teacherCount = count;
      },
      error: (error) => {
        console.error('Error fetching teacher count', error);
        alert('Error fetching teacher count. Please try again later.');
      }
    });
  }

  getStudentCount() {
    this.dashboardService.getStudentCount().subscribe({
      next: (count) => {
        this.studentCount = count;
      },
      error: (error) => {
        console.error('Error fetching student count', error);
        alert('Error fetching student count. Please try again later.');
      }
    });
  }

  initializeChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: [],
        datasets: [
          {
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
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        plugins: {
          title: {
            display: true,
            text: 'Paper Submissions - Last 60 Minutes',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#4f46e5',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Time',
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'Number of Submissions',
            },
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              stepSize: 1,
            },
          },
        },
        animation: {
          duration: 750,
          easing: 'easeInOutQuart',
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  startRealTimeUpdates(): void {
    // Initial load
    this.loadChartData();

    // Update every second
    this.refreshSubscription = interval(1000)
      .pipe(
        switchMap(() => this.submissionChartService.getLiveSubmissions()),
        catchError((error) => {
          console.error('Error fetching live data:', error);
          this.error = 'Failed to fetch live data';
          return of(null);
        })
      )
      .subscribe((liveData) => {
        if (liveData) {
          this.updateLiveData(liveData);
          this.error = null;
        }
      });

    // Update chart data every 30 seconds
    interval(30000)
      .pipe(
        switchMap(() =>
          this.submissionChartService.getSubmissionsByMinute(this.timeRange)
        ),
        catchError((error) => {
          console.error('Error fetching chart data:', error);
          return of([]);
        })
      )
      .subscribe((data) => {
        if (data.length > 0) {
          this.updateChartData(data);
        }
      });
  }

  loadChartData(): void {
    this.isLoading = true;
    this.submissionChartService
      .getSubmissionsByMinute(this.timeRange)
      .subscribe({
        next: (data) => {
          this.updateChartData(data);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading chart data:', error);
          this.error = 'Failed to load chart data';
          this.isLoading = false;
        },
      });
  }

  updateChartData(data: ChartDataPoint[]): void {
    this.chartData = data;

    if (this.chart) {
      this.chart.data.labels = data.map((d) => d.time);
      this.chart.data.datasets[0].data = data.map((d) => d.count);
      this.chart.update('none'); // No animation for real-time updates
    }
  }

  updateLiveData(data: LiveSubmissionData): void {
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
