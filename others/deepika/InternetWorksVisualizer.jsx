import React, { useState } from 'react';
import { audioService } from '../../services/audioService';
import { Send, Server, Laptop, Wifi, Globe } from 'lucide-react';

export default function InternetWorksVisualizer() {
  const [packetProgress, setPacketProgress] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const handleSendPacket = () => {
    if (isSending) return;
    audioService.playClickSound();
    setIsSending(true);
    setPacketProgress(1);

    setTimeout(() => setPacketProgress(2), 600);
    setTimeout(() => setPacketProgress(3), 1200);
    setTimeout(() => {
      setPacketProgress(4);
      audioService.playSuccessSound();
      setIsSending(false);
    }, 1800);
  };

  return (
    <div className="internet-visualizer-container">
      {/* Action Button */}
      <div className="internet-toolbar">
        <button
          onClick={handleSendPacket}
          disabled={isSending}
          className="btn-send-packet"
        >
          <Send size={16} />
          <span>{isSending ? 'Data Packets Traveling...' : 'Click to Send Web Request (HTTP)'}</span>
        </button>
      </div>

      {/* Network Animation Stage */}
      <div className="network-flow-stage">
        {/* Node 1: Laptop Browser */}
        <div className={`network-node node-laptop ${packetProgress === 1 || packetProgress === 4 ? 'active-node' : ''}`}>
          <Laptop size={32} className="node-icon" />
          <strong>1. Your Browser</strong>
          <small>Request: "GET website.com"</small>
        </div>

        {/* Cable 1 */}
        <div className="network-cable">
          <div className={`packet-dot ${packetProgress === 1 ? 'packet-moving-forward' : packetProgress === 4 ? 'packet-moving-backward' : ''}`}></div>
        </div>

        {/* Node 2: Wi-Fi Router */}
        <div className={`network-node node-router ${packetProgress === 2 ? 'active-node' : ''}`}>
          <Wifi size={32} className="node-icon" />
          <strong>2. Wi-Fi Router</strong>
          <small>Packet Routing</small>
        </div>

        {/* Cable 2 */}
        <div className="network-cable">
          <div className={`packet-dot ${packetProgress === 2 || packetProgress === 3 ? 'packet-moving-forward' : ''}`}></div>
        </div>

        {/* Node 3: Cloud Web Server */}
        <div className={`network-node node-server ${packetProgress === 3 ? 'active-node' : ''}`}>
          <Server size={32} className="node-icon" />
          <strong>3. Web Server</strong>
          <small>Sends HTML & Visuals</small>
        </div>
      </div>

      {/* Packet Step Description */}
      <div className="network-status-box">
        {packetProgress === 0 && <p>👆 Click "Send Web Request" to watch data packets travel at the speed of light!</p>}
        {packetProgress === 1 && <p>📦 Step 1: Your browser breaks your click into digital data packets and sends them over Wi-Fi.</p>}
        {packetProgress === 2 && <p>🌐 Step 2: Routers and fiber cables direct packets across the internet to the destination server.</p>}
        {packetProgress === 3 && <p>🖥️ Step 3: The web server processes the request and packages up the visual web page.</p>}
        {packetProgress === 4 && <p>✅ Step 4: Packets arrive back at your laptop and assemble into the finished web page!</p>}
      </div>
    </div>
  );
}
