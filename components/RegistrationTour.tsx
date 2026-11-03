"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle, Info } from "lucide-react";

export interface TourStep {
  targetId: string;
  title: string;
  description: string;
  tip?: string;
  actionText?: string;
}

interface RegistrationTourProps {
  isOpen: boolean;
  onClose: () => void;
  isTeamSport: boolean;
  minPlayers: number;
}

export function RegistrationTour({
  isOpen,
  onClose,
  isTeamSport,
  minPlayers,
}: RegistrationTourProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: TourStep[] = [
    {
      targetId: "tour-sport-category",
      title: "1. Select Sport & Category",
      description: "Pick your specific sport, sub-event (e.g. 100m, Football, Kabaddi), and age group.",
      tip: "💡 Open Category is selected by default if no age restriction applies.",
      actionText: "Choose category",
    },
    {
      targetId: isTeamSport ? "tour-team-details" : "tour-participant-details",
      title: isTeamSport ? "2. Team & Playing Squad" : "2. Athlete Name",
      description: isTeamSport
        ? `Enter your Team Name and Captain Name. Enter at least ${minPlayers} player names for the playing squad. Vice Captain is optional.`
        : "Enter the athlete's full name as it should appear on the official sports pass and certificates.",
      tip: isTeamSport
        ? `💡 Only ${minPlayers} players are mandatory! Click '+ Add Player' to add substitutes up to 18.`
        : "💡 Make sure your name matches your school or ID card.",
      actionText: "Fill roster",
    },
    {
      targetId: "tour-contact-location",
      title: "3. Phone & Village Location",
      description: "Enter your phone number for SMS/WhatsApp match alerts. Enter your village or town name.",
      tip: "💡 Tap the 📍 location pin icon to auto-detect your village name directly!",
      actionText: "Enter contact",
    },
    {
      targetId: "tour-payment",
      title: "4. UPI Payment & Proof",
      description: "Tap 'Copy' to copy the official BKV UPI ID, send the entry fee from PhonePe, GPay, or Paytm, and upload the payment screenshot.",
      tip: "💡 Your payment screenshot gives instant verification priority at the match venue.",
      actionText: "Attach screenshot",
    },
    {
      targetId: "tour-submit-btn",
      title: "5. Preview & Instant Match Pass",
      description: "Click 'Preview Registration' to verify all details, then confirm to instantly generate and download your official BKV Pass with QR code!",
      tip: "💡 You can present this digital pass on your phone at the ground registration desk.",
      actionText: "Generate Pass",
    },
  ];

  const currentStep = steps[currentStepIndex];

  const updatePosition = useCallback(() => {
    if (!isOpen || !currentStep) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleResize = () => updatePosition();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleResize, { passive: true });
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleResize);
      };
    }
  }, [isOpen, currentStepIndex, updatePosition]);

  if (!isOpen || !currentStep) return null;

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Semi-transparent Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Spotlight Ring around target element */}
      {targetRect && (
        <div
          style={{
            top: `${Math.max(8, targetRect.top - 8)}px`,
            left: `${Math.max(8, targetRect.left - 8)}px`,
            width: `${Math.min(window.innerWidth - 16, targetRect.width + 16)}px`,
            height: `${targetRect.height + 16}px`,
          }}
          className="absolute rounded-2xl pointer-events-none ring-4 ring-primary ring-offset-4 ring-offset-transparent shadow-[0_0_50px_rgba(249,115,22,0.4)] transition-all duration-300 ease-out z-50 animate-pulse"
        />
      )}

      {/* Floating Tour Card */}
      <div className="fixed inset-x-4 bottom-6 sm:bottom-auto sm:top-24 sm:left-1/2 sm:-translate-x-1/2 max-w-lg w-full z-50 pointer-events-auto">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary/30 p-6 space-y-4 text-slate-900 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-primary/10 text-primary rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </span>
              <div>
                <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                  {currentStep.title}
                </h4>
                <p className="text-xs font-semibold text-muted-foreground">
                  Guided Walkthrough • Step {currentStepIndex + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Close Guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {currentStep.description}
          </p>

          {/* Contextual Tip */}
          {currentStep.tip && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-medium text-amber-900 flex items-start gap-2">
              <span className="shrink-0">{currentStep.tip}</span>
            </div>
          )}

          {/* Step Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          {/* Controls Footer */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              disabled={isFirstStep}
              className="font-bold text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="font-bold text-xs"
              >
                Skip Tour
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="font-bold text-xs shadow-md"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1 text-green-300" /> Got It! Start Registering
                  </>
                ) : (
                  <>
                    Next Step <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
