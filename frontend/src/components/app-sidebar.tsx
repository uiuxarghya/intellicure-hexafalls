"use client";

import {
  IconBrain,
  IconDashboard,
  IconDna2,
  IconHeartbeat,
  IconHelp,
  IconLungs,
  IconPillFilled,
  IconReportMedical,
  IconSettings,
  IconStethoscope,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from "@/components/ui/sidebar";
import Logo, { LogoMark } from "./logo";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Medical Doc Simplifier",
      url: "/arthamed",
      icon: IconPillFilled,
    },
    {
      title: "Appointment Booking",
      url: "/appointments",
      icon: IconStethoscope,
    },
    {
      title: "Alzheimer's Detector",
      url: "/smritiyan",
      icon: IconBrain,
    },
    {
      title: "Disease Predictor",
      url: "/rog-drishti",
      icon: IconHeartbeat,
    },
    {
      title: "Pneumonia Classifier",
      url: "/shwaas-veda",
      icon: IconLungs,
    },
    {
      title: "Brain Tumor Detector",
      url: "/neuro-setu",
      icon: IconDna2,
    },
    {
      title: "View Your Records",
      url: "/records",
      icon: IconReportMedical,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/help",
      icon: IconHelp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const sidebar = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {sidebar.state === "collapsed" ? (
          <a href="#">
            <LogoMark className="h-6 m-2 text-foreground" />
          </a>
        ) : (
          <a href="#">
            <Logo className="h-6 m-2 text-foreground" />
          </a>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
