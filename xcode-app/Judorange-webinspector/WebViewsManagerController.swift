//
//  WebViewsController.swift
//  Judorange-webinspector
//
//  Created by Julien Cuénot on 03/07/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit
import WebKit





class WebViewsManagerController:UIViewController, WebViewDelegate {

    
    // DEAL WITH PARENT VIEW CONTROLLER'ViewController' =========================
    var webViewsManagerDelegate: WebViewsManagerDelegate?
    // ==========================================================================
    
    
    
    // DEAL WITH CHILD VIEW CONTROLLER(s) =======================================
    
    // Need to write "webViewController!.webViewDelegate = self" below
    // ==========================================================================
    
    
    
    // PROPERTIES
    var currentWebWiew = 0
    var webViewControllers:Array<WebViewController> = Array()
    var history:Array<String> = Array()
    
    
    
    // View did load
    override func viewDidLoad() {
        super.viewDidLoad()
        addWebView()
        setCurrentWebView(index: 0)
        // GET HISTORY
        let defaults = UserDefaults.standard
        history = defaults.stringArray(forKey: "History") ?? [String]()
    }
    
    
    
    // Add web view
    func addWebView(){
        let  webview_count = webViewControllers.count // Get current number of webviews
        print(webview_count)
        let new_webview = WebViewController(wv_id: webview_count)  // Create webView ctrl
        webViewControllers.append( new_webview ) // Add to array
        // Allow new webview to call parent funcs with delegate
        webViewControllers[webview_count].webViewDelegate = self
        // Auto resize webview to fit view
        new_webview.webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        new_webview.webView.frame = CGRect(origin: CGPoint.zero, size: view.frame.size)
        // Start with local
        new_webview.loadLocalWebsite()
    }
    
    
    
    // Set current web view
    func setCurrentWebView(index: Int){ // loadView or viewDidLoad
        currentWebWiew = index // Set current web view property
        view = webViewControllers[index].webView
    }
    
    
    
    // Set current web view
    func removeWebView(index: Int){ // loadView or viewDidLoad
        print(index)
        print(webViewControllers.count)
        let max_index = webViewControllers.count-1
        // SELECT NEXT TAB OR LAST TAB
        if index == 0 {
            setCurrentWebView(index:1) // WV 1 HAS BECOME 0
            webViewControllers.remove(at:index)
            currentWebWiew = 0
        }
        else if index > 0 && index < max_index {
            webViewControllers.remove(at:index)
            setCurrentWebView(index:index)
            currentWebWiew = index
        }
        else if index == max_index {
            setCurrentWebView(index:max_index-1) // SET WV IS THE LAST
            webViewControllers.remove(at:index)
            currentWebWiew = max_index-1
        }
        else{
            // < 0 Do Nothing
        }
        print(webViewControllers.count)
    }
    
    
    
    // Call parent view controller
    func updateBackForwardBtnStates(sender: WebViewController){
        // FIND SENDER THEN SEND ITS INDEX
        var i = 0
        for webViewController in webViewControllers{
            if sender === webViewController{
                if i == currentWebWiew{ // Do not update if we are on another tab
                    print("• Update Back/Forward. Sender : " + String(i) )
                    webViewsManagerDelegate?.updateBackForwardBtnStates(index: i)
                    break
                }
            }
            i += 1
        }
    }
    @IBAction func updateUrlField(sender: WebViewController){
        // FIND SENDER THEN SEND ITS INDEX
        var i = 0
        for webViewController in webViewControllers{
            if sender === webViewController{
                if i == currentWebWiew{ // Do not update if we are on another tab
                    print("• Update URL. Sender : " + String(i) )
                    webViewsManagerDelegate?.updateUrlField(index: i)
                    break
                }
            }
            i += 1
        }
    }
    func updateTabName(sender: WebViewController){
        // FIND SENDER THEN SEND ITS INDEX
        var i = 0
        for webViewController in webViewControllers{
            if sender === webViewController{
                print("• Update Tab name. Sender : " + String(i) )
                webViewsManagerDelegate?.updateTabName(index: i)
                break
            }
            i += 1
        }
    }
    
    // SAVE HISTORY
    func newHistory(url: String){
        if url.contains("file://") == false {
            print("• New history " + url)
            history.insert(url, at: 0)
            let max = history.count - 1
            for i in 0 ... max {
                if i > 49 {
                    print("• Remove history " + history[i] )
                    history.remove(at: i)
                }
            }
            let defaults = UserDefaults.standard
            defaults.set(history, forKey: "History")
        }
    }
    
    
    
    
    // EXECUTE HERE INSTEAD OF WEBVIEW CONTROLLER BECAUSE ITS MODAL AND IT CANT DO IT
    func javascriptAlertPresent(alertController: UIAlertController) {
        // iPad crash without this - - - -
        /*alertController.modalPresentationStyle = .popover
        alertController.popoverPresentationController?.sourceView = view
        alertController.popoverPresentationController?.sourceRect =
            CGRect(
                x: self.view.bounds.midX,
                y: self.view.bounds.midY,
                width: 0, height: 0
        )
        alertController.popoverPresentationController?.permittedArrowDirections = []*/
        // - - - - - - - - - - - - - - - - -
        present(alertController, animated: true, completion: nil)
    }
    
    
    
} // End of class


